import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onFilterItem } = props;
  const [inputSearch, setInputSearch] = useState('')
  const inputRef = useRef()

  useEffect( () => {
    
    const timer = setTimeout(() => {
      if(inputSearch === inputRef.current.value)
      {
        const query = inputSearch.length === 0 ? '' : `?orderBy="title"&equalTo="${inputSearch}"`;
        fetch(`https://react-hooks-662ae.firebaseio.com/ingredients.json${query}`)
          .then(res => {
            return res.json()
          })
          .then(res => {
            onFilterItem(res)
          })
      }
    }, 500);
    
    return () => {
      clearTimeout(timer);
    }

  }, [inputSearch, onFilterItem])



  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} type="text" />
        </div>
      </Card>
    </section>
  );
});

export default Search;
