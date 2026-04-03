import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Heart, Plus, Shield, Search, Filter } from 'lucide-react';
import { db, useAuth, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { Post } from '../types';
import { cn } from '../lib/utils';

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', category: 'support' as Post['category'] });
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'posts'));
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.content.trim() || !user) return;
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: "Anonim Ayol",
        content: newPost.content,
        category: newPost.category,
        likesCount: 0,
        repliesCount: 0,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewPost({ content: '', category: 'support' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        likesCount: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `posts/${postId}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-32">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-on-surface">Hamjamiyat</h1>
          <p className="text-on-surface-variant">Bir-birimizga dalda bo'lamiz va tajriba almashamiz.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Post yaratish
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
        {['Hammasi', 'Yordam', 'Huquqiy', 'Psixologik', 'Muvaffaqiyat'].map((cat) => (
          <button key={cat} className="px-5 py-2 bg-surface-container-low rounded-full text-sm font-bold whitespace-nowrap hover:bg-primary/10 hover:text-primary transition-colors">
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center text-primary">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">{post.authorName}</h3>
                  <p className="text-[10px] text-outline font-bold uppercase tracking-widest">{post.category}</p>
                </div>
              </div>
              <span className="text-xs text-outline-variant">Hozirgina</span>
            </div>
            <p className="text-on-surface leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-6 pt-4 border-t border-outline-variant/10">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors"
              >
                <Heart size={18} className={post.likesCount > 0 ? "fill-error text-error" : ""} />
                <span className="text-sm font-bold">{post.likesCount}</span>
              </button>
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                <MessageCircle size={18} />
                <span className="text-sm font-bold">{post.repliesCount}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-lg rounded-2xl p-8 space-y-6 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-on-surface">Yangi post yaratish</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest">Kategoriya</label>
                  <select 
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value as any})}
                    className="w-full bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="support">Yordam</option>
                    <option value="legal">Huquqiy maslahat</option>
                    <option value="psychological">Psixologik holat</option>
                    <option value="success">Muvaffaqiyat hikoyasi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest">Sizning fikringiz</label>
                  <textarea
                    rows={5}
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Nima haqida yozmoqchisiz?.."
                    className="w-full bg-surface-container-low border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-surface-container-highest rounded-full font-bold text-on-surface"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleCreatePost}
                  className="flex-1 py-3 bg-primary text-white rounded-full font-bold shadow-lg"
                >
                  Yuborish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
