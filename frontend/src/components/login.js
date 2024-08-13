import '../App.css';


function login() {
  return (
    <div className='container-login'>
        <form> 
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' name='email'required/>


        <label htmlFor='password'>Password</label>
        <input type='password' id='password' name='password'required/>

        <button type='submit'>Login</button>
        </form>

      
    </div>
  );
}

export default login;
