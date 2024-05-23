import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TablePagination, TableSortLabel, Paper
} from '@mui/material';

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, [page, rowsPerPage]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`https://openlibrary.org/subjects/love.json?limit=${rowsPerPage}&offset=${page * rowsPerPage}`);
      const totalBooks = response.data.work_count;  // Assuming the API provides the total count
      setTotalBooks(totalBooks);

      const booksData = response.data.works.map(async (work) => {
        const authorResponse = await axios.get(`https://openlibrary.org${work.authors[0].key}.json`);
        return {
          title: work.title,
          authorName: authorResponse.data.name,
          firstPublishYear: work.first_publish_year,
          subject: work.subject ? work.subject.join(', ') : '',
          ratingsAverage: work.ratings_average || 'N/A',
          authorBirthDate: authorResponse.data.birth_date || 'N/A',
          authorTopWork: authorResponse.data.top_work || 'N/A',
        };
      });
      setBooks(await Promise.all(booksData));
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedBooks = books.slice().sort((a, b) => {
    if (orderBy === 'ratingsAverage') {
      const aValue = a.ratingsAverage === 'N/A' ? 0 : a.ratingsAverage;
      const bValue = b.ratingsAverage === 'N/A' ? 0 : b.ratingsAverage;
      return (aValue - bValue) * (order === 'asc' ? 1 : -1);
    } else if (orderBy === 'firstPublishYear') {
      return (a.firstPublishYear - b.firstPublishYear) * (order === 'asc' ? 1 : -1);
    } else if (orderBy === 'authorBirthDate') {
      const aValue = a.authorBirthDate === 'N/A' ? '' : a.authorBirthDate;
      const bValue = b.authorBirthDate === 'N/A' ? '' : b.authorBirthDate;
      return aValue.localeCompare(bValue) * (order === 'asc' ? 1 : -1);
    } else {
      return a[orderBy].localeCompare(b[orderBy]) * (order === 'asc' ? 1 : -1);
    }
  });

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'ratingsAverage'}
                  direction={orderBy === 'ratingsAverage' ? order : 'asc'}
                  onClick={() => handleSortRequest('ratingsAverage')}
                >
                  Ratings Average
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'authorName'}
                  direction={orderBy === 'authorName' ? order : 'asc'}
                  onClick={() => handleSortRequest('authorName')}
                >
                  Author Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleSortRequest('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'firstPublishYear'}
                  direction={orderBy === 'firstPublishYear' ? order : 'asc'}
                  onClick={() => handleSortRequest('firstPublishYear')}
                >
                  First Publish Year
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'subject'}
                  direction={orderBy === 'subject' ? order : 'asc'}
                  onClick={() => handleSortRequest('subject')}
                >
                  Subject
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'authorBirthDate'}
                  direction={orderBy === 'authorBirthDate' ? order : 'asc'}
                  onClick={() => handleSortRequest('authorBirthDate')}
                >
                  Author Birth Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'authorTopWork'}
                  direction={orderBy === 'authorTopWork' ? order : 'asc'}
                  onClick={() => handleSortRequest('authorTopWork')}
                >
                  Author Top Work
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBooks.map((book, index) => (
              <TableRow key={index}>
                <TableCell>{book.ratingsAverage}</TableCell>
                <TableCell>{book.authorName}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.firstPublishYear}</TableCell>
                <TableCell>{book.subject}</TableCell>
                <TableCell>{book.authorBirthDate}</TableCell>
                <TableCell>{book.authorTopWork}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalBooks}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default BookTable;
