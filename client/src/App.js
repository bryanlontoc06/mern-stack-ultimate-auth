import Layout from "./core/Layout";

const App = () => {

  return (
    <Layout>
      <div className="col-md-6 offset-md-3 text-center">
        <h1 className="p-5">React Node MongoDB Authentication Boilerplate</h1>
        <h2>MERN Stack</h2>
        <hr/>
        <p className="lead">
          MERN stack login register system with account activation, login with facebook and google as well as private and protected routes for authenticated user and users with the role of admin.
        </p>
        <h3>Bonus</h3>
        <p className="lead">
          Profile update & deployment to digital ocean cloud server.
        </p>
      </div>
    </Layout>
  );
};

export default App;
