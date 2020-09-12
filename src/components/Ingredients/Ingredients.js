import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from './../UI/ErrorModal';


function Ingredients() {
  const [ userIngredients, setUserIngredients ] = useState([]); 
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState();

  const addIngredient = (ingredient) => {
    setIsLoading(true);
    fetch('https://react-hooks-662ae.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      setIsLoading(false);
      return res.json()
    })
    .then(res => {
      setUserIngredients( prevIngredients => [
        ...prevIngredients, 
        { id: res.name , ...ingredient }
      ])
    })
    .catch(err => {
      setIsLoading(false);
      setError(err.message)
    })
  }

  const removeIngredient = (id) => {
    setIsLoading(true);
    fetch(`https://react-hooks-662ae.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(res => {
      setIsLoading(false);
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

  const onCloseModal = () => {
    setError()
  }

  return (
    <div className="App">
      <IngredientForm 
        isLoading={isLoading}
        addIngredients={addIngredient} 
      />

      <section>
        <Search onFilterItem={onFilterItem} />
        <IngredientList 
          isLoading={isLoading}
          ingredients={userIngredients} 
          onRemoveItem={(id) => removeIngredient(id)} />
      </section>

      {error && <ErrorModal onClose={onCloseModal}>{error}</ErrorModal> }
    </div>
  );
}

export default Ingredients;
