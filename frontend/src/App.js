import './App.css';
import Header from './components/Header';
import Shortener from './components/Shortener';
import MyUrls from './components/MyUrls';
import useClasses from "./components/useClasses";
import { Grid } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const styles = theme => ({
  formAlign: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30vh',
    width: '100vw'
  },
  staticHeader: {
    position: 'fixed',
  }
});

function App() {
  const classes = useClasses(styles);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <div className={[classes.formAlign]}>
            <Router>
              <div className={[classes.formAlign]}><Header /></div><br></br><br></br>
              <Routes>
                <Route path="/" element={<Shortener />} />
                <Route path="user/my-urls" element={<MyUrls />} />
              </Routes>
            </Router>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
export default App;