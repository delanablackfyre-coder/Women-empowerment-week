import React from 'react';
import { Gavel, ExternalLink, ShieldCheck, FileText, Scale, BookOpen } from 'lucide-react';

const LAWS = [
  {
    title: "Xotin-qizlarni tazyiq va zo'ravonlikdan himoya qilish to'g'risida",
    id: "4623",
    summary: "Ushbu qonun xotin-qizlarni turmushda, ish joylarida, ta'lim muassasalarida va boshqa joylarda tazyiq hamda zo'ravonlikning barcha shakllaridan himoya qilish sohasidagi munosabatlarni tartibga soladi.",
    articles: ["Himoya orderi berish tartibi", "Zo'ravonlik turlari", "Davlat organlarining vazifalari"]
  },
  {
    title: "O'zbekiston Respublikasining Mehnat Kodeksi",
    id: "5123",
    summary: "Ayollar va oilaviy vazifalarni bajarish bilan mashg'ul shaxslar uchun qo'shimcha kafolatlar va imtiyozlar.",
    articles: ["Homilador ayollar huquqlari", "Tungi ishlarga jalb qilish taqiqi", "Bolali ayollar uchun imtiyozlar"]
  },
  {
    title: "O'zbekiston Respublikasining Oila Kodeksi",
    id: "3421",
    summary: "Nikoh, oila, onalik, otalik va bolalikni himoya qilish, oilaviy munosabatlarni tartibga solish.",
    articles: ["Nikoh shartnomasi", "Aliment undirish tartibi", "Mulkni bo'lish masalalari"]
  }
];

export default function LegalPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12 pb-32">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
          <Gavel size={16} />
          <span>Huquqiy bilimlar</span>
        </div>
        <h1 className="text-4xl font-bold text-on-surface leading-tight">
          Sizning <span className="text-primary italic">huquqlaringiz</span> <br />
          qonun himoyasida
        </h1>
        <p className="text-on-surface-variant max-w-xl text-lg">
          O'zbekiston Respublikasi qonunchiligi bo'yicha xotin-qizlar uchun yaratilgan barcha imtiyoz va himoya vositalari bilan tanishing.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {LAWS.map((law) => (
          <div key={law.id} className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/10 space-y-6 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Scale size={120} />
            </div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={24} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-on-surface">{law.title}</h2>
                <p className="text-on-surface-variant leading-relaxed">{law.summary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {law.articles.map((art, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-medium text-on-surface">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {art}
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex gap-4">
                  <a 
                    href={`https://lex.uz/docs/${law.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    Lex.uz da to'liq o'qish <ExternalLink size={16} />
                  </a>
                  <button className="inline-flex items-center gap-2 text-secondary font-bold hover:underline">
                    AI xulosasini olish <BookOpen size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-surface-container-low p-8 rounded-2xl border border-dashed border-outline-variant/30 flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-on-surface">Himoya orderi nima?</h3>
          <p className="text-on-surface-variant">Agar sizga nisbatan tazyiq yoki zo'ravonlik sodir etilsa, siz 30 kunlik himoya orderini olishga haqlisiz. Bu order sizning xavfsizligingizni kafolatlaydi.</p>
          <button className="text-primary font-bold mt-2">Batafsil ma'lumot <ArrowRight size={16} className="inline" /></button>
        </div>
      </section>
    </div>
  );
}

import { ArrowRight } from 'lucide-react';
