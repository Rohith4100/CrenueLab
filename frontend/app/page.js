export default function Home() {
  return (
    <div className="page">

      <div className="banner">
        <img
          src="/CrenueLab.png"
          alt="CrenueLab Logo"
          className="bannerImage"
        />
      </div>

      <div className="topActions">
        <a href="/login">
          <button className="loginBtn">
            Login
          </button>
        </a>
      </div>

      <div className="content">

        <h1>CrenueLab</h1>

        <p className="subtitle">
          Medical Laboratory Information System
        </p>

        <p className="description">
          Streamline laboratory operations with patient management,
          test ordering, specimen tracking, laboratory testing,
          result validation, and report generation through a unified platform.
        </p>

        <div className="features">

          <div className="card">
            <h3>Patient Management</h3>
            <p>Registration, demographics, and patient records.</p>
          </div>

          <div className="card">
            <h3>LAB Test Orders</h3>
            <p>Create, update, prioritize, and track orders.</p>
          </div>

          <div className="card">
            <h3>Laboratory Workflow</h3>
            <p>Sample collection, testing, and processing.</p>
          </div>

          <div className="card">
            <h3>Reports & Results</h3>
            <p>Validation, approvals, and PDF report generation.</p>
          </div>

        </div>

      </div>

    </div>
  );
}