const forgetpassword = () => {
  return (
    <div className="card">
      {/*Decorative.Line*/}
      <div >
        <img className="deco-line"
          src="./Images/line.png"
          alt="line"
          width={500}
          height={150}
        ></img>
      </div>
      <h1>Forgot Password</h1>
      <div className="field">
        <label>EMAIL</label>
        <input type="email" placeholder="Example1@gamil.com" />
      </div>

      <button className="send-btn">Send Code</button>

      <div className="logo">
        <img
          src="/Images/Logo.png"
          alt="logoImage"
          width={50}
          height={30}
        ></img>

      </div>
    </div>

  );
};
export default forgetpassword;