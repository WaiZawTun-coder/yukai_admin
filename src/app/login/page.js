const Login = () => {
  return (
    <div className="login-page">
      <div className="login-card">

        <img
          src="./Images/line logo.png"
          alt="Decoration"
          className="decor-image"
        />

        <h1 className="title">Login To Administration</h1>
        <p className="subtitle">welcome back!</p>

        <form className="login-form">
          <label>USERNAME</label>
          <input
            type="text"
            placeholder="JairoMartin"
          />

          <label>PASSWORD</label>
          <input
            type="password"
            placeholder="**"
          />

          <button type="submit">Login</button>
        </form>

        <footer className="login_footer">
          <img src="./Images/logo.png" alt="Yukai Logo" />
        </footer>

      </div>
    </div>
  );
};

export default Login;