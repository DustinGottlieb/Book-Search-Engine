import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation} from '@apollo/client';
import { GET_ME } from '../crud/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { REMOVE_BOOK } from '../crud/mutations';

const SavedBooks = () => {
  let userData = {}
    
  const { loading, data } = useQuery(GET_ME)
  const [deleteBook] = useMutation(REMOVE_BOOK)
  if (!loading) {
    userData = data.me
  }

  const handleDeleteBook = async (bookId) => {


    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    
    try {
      const { data } = await deleteBook({
        variables: { bookId }
      })
      if (!data) {
        throw new Error('something went wrong!');
      }
      
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (userData.savedBooks.length === 0 || userData.savedBooks === [null]) {
    return <h2>No books</h2>
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
