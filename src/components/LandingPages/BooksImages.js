import React from 'react';

import './LandingPage.css';

import book1 from '../../assets/BooksImages/book1.jpeg'
import book2 from '../../assets/BooksImages/book2.jpeg'
import book11 from '../../assets/BooksImages/book11.jpeg'
import book22 from '../../assets/BooksImages/book22.jpeg'
import book33 from '../../assets/BooksImages/book33.jpeg'

const books = [
    {
        id: 1,
        imageUrl: book1,
        author: 'The Last Four Things',
        rating: 3.92

    },
    {
        id: 2,
        imageUrl: book11,
        author: 'Harry Potter',
        rating: 3.92
    },

    {
        id: 3,
        imageUrl: book2,
        author: 'Avengers',
        rating: 3.92
    },
    {
        id: 4,
        imageUrl: book22,
        author: 'Mathematics',
        rating: 3.92
    },
    {
        id: 5,
        imageUrl: book33,
        author: 'The Beauty In Math',
        rating: 3.92
    },
    {
        id: 6,
        imageUrl: book2,
        author: 'Avengers',
        rating: 3.92
    },
    {
        id: 7,
        imageUrl: book1,
        author: 'The Last Four Things',
        rating: 3.92
    },
    {
        id: 8,
        imageUrl: book33,
        author: 'The Beauty In Math',
        rating: 3.92
    },
];

const BookCard = ({ imageUrl, title, author, rating }) => {
    return (

        <div className="book-card">
            <img src={imageUrl} className="book-image" alt='img' />
            <div className="card-info">
                <h6 className="book-author">{author}</h6>
                <div className="book-rating">
                    <span className="stars">
                        ★★★★☆
                    </span>
                    <span className="rating-number">{rating}</span>
                </div>
            </div>
        </div>
    );
};

const BooksImages = () => {


    return (
        <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 book-images">
                {books.map(tour => (
                    <div className="col" key={tour.id}>
                        <BookCard
                            imageUrl={tour.imageUrl}
                            author={tour.author}
                            rating={tour.rating}
                        />
                    </div>
                ))}
            </div>

        </>
    );
};
export default BooksImages

