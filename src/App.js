import { useState } from "react";
import "./app.css";
import Footer from "./components/Footer";
import TopBar from "./components/TopBar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import EachCourse from "./components/EachCourse";
import axios from "axios";

function App() {
  const [darkmode, setDarkmode] = useState(false);
  const [courses, setCourses] = useState([]);
  const [codeState, setCodeState] = useState("");
  const [gradeState, setGradeState] = useState("A");
  const [unitState, setUnitState] = useState(5);
  const [calculating, setCalculating] = useState(false);
  const [response, setResponse] = useState("");

  const addCourse = (code, grade, unit) => {
    if (codeState) {
      const newCourses = [...courses];
      const uid = newCourses.length + 1;
      newCourses.push({ id: uid, code, grade, unit });
      setCourses(newCourses);
    }
  };

  const filterCourses = (id) => {
    const newArr = courses.filter((single) => {
      return single.id !== id;
    });

    setCourses(newArr);
  };

  const handleClear = () => {
    setCourses([]);
    setResponse('');
  };

  const calculateGP = async () => {
    setCalculating(true);
    let data = { grades: [], units: [] };
    courses.forEach((single) => {
      data.grades.push(single.grade);
      data.units.push(parseInt(single.unit));
    });
    console.log(data);
    // console.log(data);
    await axios
      .post("https://toluwanimi.pythonanywhere.com/", data)
      .then((res) => {
        console.log(res);
        setCalculating(false);
        setResponse(res.data.data)
      })
      .catch((err) => {
        console.log(err);
        setCalculating(false);
        setResponse('ERROR!! clear inputs and try again!')
      });
  };

  return (
    <>
      <main
        style={{
          backgroundColor: darkmode ? "rgb(0, 0, 22)" : "aliceblue",
          color: darkmode ? "white" : "rgb(71, 71, 71)",
        }}
        className="app"
      >
        <div className="top-container">
          <TopBar darkmode={darkmode} setDarkmode={setDarkmode} />
        </div>
        <div className="main-body">
          <div className="main-body-top">
            <div className="sem-con">
              <h3>Calculate your GP</h3>
              {/* <h3>Semester:</h3>{" "}
              <select
                style={{
                  color: darkmode ? "white" : "rgb(71, 71, 71)",
                }}
              >
                <option>First</option>
                <option>Second</option>
              </select> */}
            </div>
            <div className="btn-con">
              <button
                onClick={() => addCourse(codeState, gradeState, unitState)}
                className="add-btn"
              >
                {" "}
                <AddCircleOutlineIcon /> Add Course{" "}
              </button>
              <button onClick={handleClear} className="clear-btn">
                {" "}
                <HighlightOffIcon /> Clear{" "}
              </button>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCourse(codeState, gradeState, unitState);
            }}
            className="inputs-con"
          >
            <label>
              <span>Course Code: </span>
              <input
                style={{
                  color: darkmode ? "white" : "rgb(71, 71, 71)",
                }}
                required
                value={codeState}
                onChange={(e) => setCodeState(e.target.value)}
                type="text"
                placeholder="course code..."
              />
            </label>
            <label>
              <span>Grade: </span>
              <select
                required
                style={{
                  color: darkmode ? "white" : "rgb(71, 71, 71)",
                }}
                value={gradeState}
                onChange={(e) => setGradeState(e.target.value)}
              >
                <option value={"A"}>A</option>
                <option value={"B"}>B</option>
                <option value={"C"}>C</option>
                <option value={"D"}>D</option>
                <option value={"E"}>E</option>
                <option value={"F"}>F</option>
              </select>
            </label>
            <label>
              <span>Unit: </span>
              <select
                required
                style={{
                  color: darkmode ? "white" : "rgb(71, 71, 71)",
                }}
                value={unitState}
                onChange={(e) => setUnitState(e.target.value)}
              >
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
            </label>
          </form>
          <div
            style={{
              backgroundColor: darkmode ? "rgba(3, 3, 26, 0.733)" : "white",
              display: courses.length > 0 ? "block" : "none",
            }}
            className="cal-body"
          >
            <div className="res-iten head">
              <span title="Course Code" className="code-item">
                Code
              </span>
              <span title="Grade" className="grade-item">
                G
              </span>
              <span title="Unit" className="unit-item">
                U
              </span>
            </div>

            {courses.map((singleCourse, index) => (
              <EachCourse
                data={singleCourse}
                key={index}
                filter={filterCourses}
              />
            ))}

            <div className="submit-btn-con">
              <button disabled={calculating} onClick={calculateGP}>
                {calculating ? "Calculating..." : "Calculate"}
              </button>
            </div>
            {response && (
              <div className="response-con">
                {" "}
                <h3>{response}</h3>
              </div>
            )}
          </div>
        </div>
        <div className="footer-container">
          <Footer />
        </div>
      </main>
    </>
  );
}

export default App;
