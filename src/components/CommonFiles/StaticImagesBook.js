import React from 'react';

import './CommonCSS/StaticImages.css';

// import book1 from '../../assets/BooksImages/book1.jpeg'
// import book2 from '../../assets/BooksImages/book2.jpeg'
// import book11 from '../../assets/BooksImages/book11.jpeg'
// import book22 from '../../assets/BooksImages/book22.jpeg'
// import book33 from '../../assets/BooksImages/book33.jpeg'


import book1 from '../../assets/BookImg/book1.jpg'
import book2 from '../../assets/BookImg/book 2.jpg'
import book3 from '../../assets/BookImg/book 3.jpg'
import book4 from '../../assets/BookImg/book 4.jpg'
import book5 from '../../assets/BookImg/book 5.jpg'
import book6 from '../../assets/BookImg/book 6.jpg'
import book7 from '../../assets/BookImg/book7.jpg'
import book8 from '../../assets/BookImg/book8.jpg'


const books = [
    {
        id: 1,
        imageUrl: book1,
        author: 'The Women',
        rating: 3.92

    },
    {
        id: 2,
        imageUrl: book2,
        author: 'The Heiress',
        rating: 3.86
    },

    {
        id: 3,
        imageUrl: book3,
        author: 'Harry Potter',
        rating: 4.92
    },
    {
        id: 4,
        imageUrl: book4,
        author: 'Kung Fu Panda 2',
        rating: 3.65
    },
    {
        id: 5,
        imageUrl: book5,
        author: 'Captain America',
        rating: 4.95
    },
    {
        id: 6,
        imageUrl: book6,
        author: 'Neil Gaiman',
        rating: 3.82
    },
    {
        id: 7,
        imageUrl: book7,
        author: 'Dog Man',
        rating: 3.70
    },
    {
        id: 8,
        imageUrl: book8,
        author: 'Blood Of Elves',
        rating: 3.56
    },
];

const BookCard = ({ imageUrl, author, rating }) => {
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
        <div className='static-images'>
            <div className='d-flex justify-content-center'>
                <h2>Our Newly Launch Collection</h2>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-3 book-images ">
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

        </div>
    );
};
export default BooksImages

