const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f3f2f1;
    color: #1a1a1a;
    min-height: 100vh;
    font-size: 14px;
    line-height: 1.5;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #f0f0f0; }
  ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: none; }
  }

  input, select, textarea {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    color: #1a1a1a;
    background: #fff;
    border: 1px solid #c9cccf;
    border-radius: 4px;
    padding: 9px 12px;
    outline: none;
    width: 100%;
    transition: border-color .15s, box-shadow .15s;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #e05c00;
    box-shadow: 0 0 0 2px #e05c0020;
  }
  input::placeholder, textarea::placeholder { color: #9aa0a6; }

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #444;
    margin-bottom: 4px;
  }

  button { font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; border: none; }

  .card {
    background: #fff;
    border: 1px solid #d4d2d0;
    border-radius: 8px;
  }

  .job-card {
    background: #fff;
    border: 1px solid #d4d2d0;
    border-radius: 8px;
    padding: 20px 24px;
    transition: box-shadow .2s ease, border-color .2s ease, transform .2s ease;
    cursor: pointer;
    animation: fadeIn .35s ease both;
  }
  .job-card:hover {
    box-shadow: 0 6px 20px rgba(224,92,0,.12);
    border-color: #e05c00;
    transform: translateY(-1px);
  }

  .pill {
    display: inline-block;
    background: #f0f0f0;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 2px 10px;
    font-size: 12px;
    color: #555;
    font-weight: 500;
  }
`;

export default globalStyles;
