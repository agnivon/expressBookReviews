import db from "./src/db/client";
import { books } from "./src/db/schema";

const data = {
  1: { author: "Chinua Achebe", title: "Things Fall Apart", reviews: {} },
  2: { author: "Hans Christian Andersen", title: "Fairy tales", reviews: {} },
  3: { author: "Dante Alighieri", title: "The Divine Comedy", reviews: {} },
  4: { author: "Unknown", title: "The Epic Of Gilgamesh", reviews: {} },
  5: { author: "Unknown", title: "The Book Of Job", reviews: {} },
  6: { author: "Unknown", title: "One Thousand and One Nights", reviews: {} },
  7: { author: "Unknown", title: "Nj\u00e1l's Saga", reviews: {} },
  8: { author: "Jane Austen", title: "Pride and Prejudice", reviews: {} },
  9: { author: "Honoré de Balzac", title: "Le Père Goriot", reviews: {} },
  10: {
    author: "Samuel Beckett",
    title: "Molloy, Malone Dies, The Unnamable, the trilogy",
    reviews: {},
  },
};

const bookList = Object.values(data).map(({ author, title }) => ({
  author,
  title,
}));

async function insertBooks() {
  await db.insert(books).values(bookList);
}

// Call the function to perform the insertion
insertBooks().catch(console.error);
