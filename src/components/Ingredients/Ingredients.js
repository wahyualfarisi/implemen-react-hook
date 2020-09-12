import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {
  const [ userIngredients, setUserIngredients ] = useState([]); 

  const addIngredient = (ingredient) => {

    fetch('https://react-hooks-662ae.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      return res.json()
    })
    .then(res => {
      setUserIngredients( prevIngredients => [
        ...prevIngredients, 
        { id: res.name , ...ingredient }
      ])
    })
  }

  const removeIngredient = (id) => {
    fetch(`https://react-hooks-662ae.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(res => {
      const filterItems = userIngredients.filter(item => item.id !== id);
      setUserIngredients(filterItems)
    })

  }

  const onFilterItem = useCallback( (ingredientsdata) => {
    let ingredients = [];
        for(let key in ingredientsdata){
          ingredients.push({
            id: key,
            title: ingredientsdata[key].title,
            amount: ingredientsdata[key].amount
          })
        }
        setUserIngredients(ingredients);
  }, [])


  return (
    <div className="App">
      <IngredientForm addIngredients={addIngredient} />

      <section>
        <Search onFilterItem={onFilterItem} />
        <IngredientList ingredients={userIngredients} onRemoveItem={(id) => removeIngredient(id)} />
      </section>
    </div>
  );
}

export default Ingredients;
