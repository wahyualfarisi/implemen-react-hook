import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from './../UI/ErrorModal';

const IngredientReducer = (currentIngredient, action) => {
  switch(action.type)
  {
    case 'SET':
        return action.ingredients 
    case 'ADD':
        return [...currentIngredient, action.ingredient]
    case 'DELETE':
        return currentIngredient.filter(item => item.id !== action.id)
    default:
      throw new Error('command not found');
  }
}

const httpReducer = (currentHttpState, action) => {
  switch(action.type)
  {
    case 'SEND':
      return { loading: true, error: null  }
    case 'RESPONSE':
      return { ...currentHttpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR':
      return { loading: false, error: null }
    default:
      throw new Error('command not found');
  }
}

function Ingredients() {
  const [ userIngredients, dispatch ] = useReducer(IngredientReducer, [])

  const [ httpState, dispatchHttp ] = useReducer(httpReducer, { loading: false, error: null })

  const addIngredient = (ingredient) => {
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-662ae.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      dispatchHttp({ type: 'RESPONSE' });
      return res.json()
    })
    .then(res => {
      dispatch( { type: 'ADD', ingredient:{ id: res.name , ...ingredient }  } )
    })
    .catch(err => {
      dispatchHttp({ type: 'ERROR', errorMessage: err.message })
    })
  }

  const removeIngredient = (id) => {
    dispatchHttp({ type: 'SEND' })
    fetch(`https://react-hooks-662ae.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE',
    }).then(res => {
      dispatchHttp({ type: 'RESPONSE' })
      dispatch({ type: 'DELETE', id: id })
    })
    .catch(err => {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Failed to remove' })
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
        dispatch({ type: 'SET', 'ingredients': ingredients });
  }, [])

  const onCloseModal = () => {
    dispatchHttp({ type: 'CLEAR' })
  }

  return (
    <div className="App">
      <IngredientForm 
        isLoading={httpState.loading}
        addIngredients={addIngredient} 
      />

      <section>
        <Search onFilterItem={onFilterItem} />
        <IngredientList 
          isLoading={httpState.loading}
          ingredients={userIngredients} 
          onRemoveItem={(id) => removeIngredient(id)} />
      </section>

      {httpState.error && <ErrorModal onClose={onCloseModal}>{httpState.error}</ErrorModal> }
    </div>
  );
}

export default Ingredients;
