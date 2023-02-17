import React from 'react'
import StarRating from '../../components/StarRating/StarRating';
import classes from './ReviewPage.module.scss'

const ReviewPage = () =>  {
  const [value, setValue] = React.useState('');

  
  return (
    <div className='mt-50'>
      {/* <form > */}
        <div className='d-flex justify-center'>
          <StarRating/>
        </div>
        <div className='mt-40 d-flex justify-center'>
          <textarea className={classes.textarea} value={value} onChange={(e) => setValue(e.target.value)} placeholder='Напишите пару слов...'/>
        </div>
        <div className='mt-20 d-flex justify-center'>
          <button className={classes.button}>Отправить</button>
        </div>
      {/* </form> */}
    </div>
  );
}

export default ReviewPage