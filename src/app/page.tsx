import Image from 'next/image';
import { Utensils } from 'lucide-react';

import { menuData } from '@/lib/menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const imageMap = new Map(PlaceHolderImages.map(img => [img.id, img]));

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <header className="container mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center gap-3">
          <Utensils className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            i369 MENU
          </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience a symphony of authentic flavors, where each dish is a masterpiece crafted with passion and the finest ingredients.
        </p>
      </header>

      <main className="container mx-auto px-4 pb-20">
        {menuData.map((category) => (
          <section key={category.id} className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                {category.name}
              </h2>
              <Separator className="mt-2 w-24 h-1 bg-primary rounded-full" />
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => {
                const image = imageMap.get(item.imageId);
                return (
                  <Card key={item.id} className="overflow-hidden bg-card shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 flex flex-col group rounded-xl">
                    {image && (
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={image.imageHint}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="flex flex-col flex-grow">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                      </CardHeader>
      
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>

                      <CardFooter>
                        <p className="text-lg font-bold text-primary">{item.price}</p>
                      </CardFooter>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      <footer className="py-8 bg-card text-center text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} i369 Restaurant. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
