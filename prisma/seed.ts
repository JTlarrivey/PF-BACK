import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tableExists = await prisma.$queryRaw`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Category')`;
    if (tableExists[0].exists) {
    // Upsert de las categorías
    const categories = [
        'Sci-Fi',
        'Cosmic Horror',
        'Fantasy',
        'Mistery',
        'Thriller',
        'Romance',
        'Dystopian',
        'Noir Fiction (Hardboiled Fiction)',
        'Poetry',
        'Magical Realism',
        'Drama/Playwriting',
        'Biography',
        'Satire',
    ];

    const categoryPromises =  categories.map(name => 
        prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        })
    );

    const categoryResults = await Promise.all(categoryPromises);
    
    const [category1, category2, category3, category4, category5, category6, category7, category8, category9, category10, category11, category12, category13] = categoryResults;

    // Upsert de los libros
    const books = [
        {
            title: 'The Martian Chronicles',
            author: 'Ray Bradbury',
            publication_year: 1950,
            description: "The Martian Chronicles is a series of stories by writer Ray Bradbury. The stories lack a fixed linear plot, but the contextual and temporal reference is the same throughout: it tells the story of humanity's arrival on Mars and the colonization of the planet.",
            categories: [category1.id, category3.id, category4.id, category7.id, category13.id],
            photoUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/hd/887b2a24060233.5632fbd9c0ea9.jpg',
        },
        {
            title: 'The Dunwich Horror',
            author: 'H.P. Lovecraft',
            publication_year: 1929,
            description: 'The Dunwich Horror is a short story written by H. P. Lovecraft in 1928. It was first published in 1929 by Weird Tales magazine. It takes place in the fictional town of Dunwich, Massachusetts, and is considered one of the cornerstones of the Cthulhu Mythos.',
            categories: [category2.id, category3.id, category4.id, category5.id, category1.id],
            photoUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/hostedimages/1484064361i/21679054.jpg',
        },
        {
            title: 'The Murders in the Rue Morge',
            author: 'Edgar Allan Poe',
            publication_year: 1841,
            description: "The Murders in the Rue Morgue, also known as The Crimes of the Rue Morgue or The Murders of the Rue Morgue, is a short story of the detective and horror genre by American writer Edgar Allan Poe, first published in Graham's Magazine in Philadelphia in April 1841",
            categories: [category4.id, category5.id, category8.id],
            photoUrl: 'https://m.media-amazon.com/images/I/51fI047HN6L._SY780_.jpg',
        },
        {
            title: 'Les Fleurs du Mal',
            author: 'Charles Baudelaire',
            publication_year: 1857,
            description: "The Flowers of Evil is a collection of poems by Charles Baudelaire. Considered the author's greatest work, it encompasses almost the entirety of his poetic output from 1840 until its first publication. The first edition consisted of 1,300 copies and was released on June 25, 1857",
            categories: [category6.id, category9.id],
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Fleurs_du_Mal_-_3rd_edition_%281869%29.JPG/220px-Fleurs_du_Mal_-_3rd_edition_%281869%29.JPG',
        },
        {
            title: 'Rhinocéros',
            author: 'Eugène Ionesco',
            publication_year: 1959,
            description: "It is considered one of the most notable works of the Theatre of the Absurd. Throughout three acts, the inhabitants of a small French town turn into rhinoceroses. The main character, Berenger, a common and simple man, often undervalued and criticized for his alcohol addiction, turns out to be the only human who does not undergo this metamorphosis.The play has been interpreted as a response and a critique of the sudden rise of fascism and Nazism in the years leading up to World War II, and it addresses themes of social conformity, culture, fascism, individual responsibility, logic, mass movements, collective alienation, philosophy, and morality.",
            categories: [category1.id, category7.id, category11.id, category13.id],
            photoUrl: 'https://i.pinimg.com/474x/6a/6a/60/6a6a6072da0a64dace67c1efa1cb1b1e.jpg',
        },
        {
            title: 'A hundred years of solitude',
            author: 'Gabriel Garcia Marquez',
            publication_year: 1967,
            description: "One Hundred Years of Solitude is a novel by Colombian writer Gabriel García Márquez, winner of the Nobel Prize in Literature in 1982. It is considered a masterpiece of both Latin American and universal literature, as well as one of the most translated and widely read works in Spanish.",
            categories: [category4.id, category6.id, category10.id],
            photoUrl: 'https://dwcp78yw3i6ob.cloudfront.net/wp-content/uploads/2016/12/12162813/100_Years_First_Ed_Hi_Res-768x1153.jpg',
        },
        {
            title: 'Ham on Rye',
            author: 'Charles Bukowski',
            publication_year: 1982,
            description: "Ham on Rye is a partially autobiographical novel written in 1982 by German-American author and poet Charles Bukowski. Written in the first person, the novel tells the story of Henry Chinaski, the barely disguised alter ego that Bukowski uses in his works. The story covers the first twenty years of the protagonist's life as he grows up in Los Angeles during the Great Depression. The prose style is very direct, as is typical of Bukowski's writing.",
            categories: [category4.id, category8.id, category12.id],
            photoUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388195001i/38501.jpg',
        },
        {
            title: 'Our share of the night',
            author: 'Mariana Enriquez',
            publication_year: 2019,
            description: "Heritage, the desire to endure, fatherhood, horror, the intimate and the political. A free and bold novel, enchanting and brilliant. A father and son travel across Argentina by road, from Buenos Aires to the Iguazu Falls on the northern border with Brazil. It is the time of the military junta, with checkpoints manned by armed soldiers and tension in the air. The son's name is Gaspar, and the father tries to protect him from the fate that has been assigned to him. The mother died under unclear circumstances in an accident that perhaps was not an accident at all",
            categories: [category2.id, category4.id, category5.id, category8.id],
            photoUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1660429329l/61111034.jpg',
        },
        {
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
            publication_year: 1954,
            description: 'The Lord of the Rings is an epic fantasy novel written by the British philologist and author J. R. R. Tolkien. Its story is set in the Third Age of the Sun in Middle-earth, a fictional place populated by humans and other anthropomorphic races, such as hobbits, elves, and dwarves, as well as many other real and fantastic creatures. The novel tells the journey of the main protagonist, Frodo Baggins, a hobbit from the Shire, to destroy the One Ring and the ensuing war that the enemy will wage to recover it, as it is the main source of power for its creator, the dark lord Sauron.',
            categories: [category3.id, category4.id, category6.id],
            photoUrl: 'https://m.media-amazon.com/images/I/7125+5E40JL._AC_UF1000,1000_QL80_.jpg',
        },
        {
            title: 'The Metamorphosis',
            author: 'Franz Kafka',
            publication_year: 1915,
            description: 'The Metamorphosis is a short novel written by Franz Kafka in 1915. The story revolves around Gregor Samsa, whose sudden transformation into a giant insect increasingly hampers communication with his social surroundings, until he is deemed intolerable by his family and ultimately perishes.',
            categories: [category1.id, category3.id, category4.id, category7.id, category13.id],
            photoUrl: 'https://images.cdn1.buscalibre.com/fit-in/360x360/7e/2b/15339a02ebbe3e7dee176487eba3add1.jpg',
        },
        {
            title: 'The Sandman',
            author: 'E.T.A. Hoffmann',
            publication_year: 1929,
            description: "'The Sandman' (German: Der Sandmann) is a short story by E. T. A. Hoffmann. It was the first in an 1817 book of stories titled Die Nachtstücke (The Night Pieces).",
            categories: [category2.id, category3.id, category4.id, category5.id],
            photoUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1177097989i/680596.jpg',
        },
        {
            title: 'The Odissey',
            author: 'Homer',
            publication_year: -800,
            description: "The Odyssey is a Greek epic poem composed of 24 cantos, attributed to the Greek poet Homer. It is believed to have been composed in the 8th century BC in the settlements that Greece had along the western coast of Asia Minor. According to other scholars, The Odyssey was completed in the 7th century BC.",
            categories: [category4.id, category6.id, category9.id, category12.id],
            photoUrl: 'https://monsieurdidot.com/wp-content/uploads/2020/02/The-Odyssey.jpg',
        },
    ];

    const bookPromises = books.map(book => 
        prisma.book.upsert({
            where: { title: book.title },
            update: {},
            create: {
                title: book.title,
                author: book.author,
                publication_year: book.publication_year,
                description: book.description,
                categories: {
                    connect: book.categories.map(id => ({ id })),
                },
                photoUrl: book.photoUrl,
            },
        })
    );

    await Promise.all(bookPromises);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
}