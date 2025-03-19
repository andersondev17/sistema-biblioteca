import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { authorsInfo, sampleBooks } from "@/constants";

const Home = () => {
  // Combinar datos del libro y autor para el BookOverview
  const firstBookWithAuthor = {
    ...sampleBooks[0],
    ...authorsInfo[0]
  };

  return (
    <div>
      <BookOverview {...firstBookWithAuthor} />
      <BookList 
        title="Mas Libros"
        books={sampleBooks} 
        authorsInfo={authorsInfo} 
        containerClassname="mt-28"
      /> 
    </div>
  );
};

export default Home;