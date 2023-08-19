import { useState, useEffect } from 'react';
import './app.css';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EachCourse from './components/EachCourse';
import axios from 'axios';
import SavedBreadcrumb from './components/SavedBreadcrumb';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function App() {
	const [darkmode, setDarkmode] = useState(false);
	const [courses, setCourses] = useState([]);
	const [codeState, setCodeState] = useState('');
	const [gradeState, setGradeState] = useState('A');
	const [unitState, setUnitState] = useState(5);
	const [calculating, setCalculating] = useState(false);
	const [response, setResponse] = useState(null);
	const [lvl, setlvl] = useState(100);
	const [semester, setSemester] = useState('First');
	const [unitCustom, setUnitCustom] = useState(false);
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		const current_lvl = JSON.parse(localStorage.getItem(`${lvl}-lvl`));
		const sem_data = current_lvl ? current_lvl.semesters.find((i) =>
			i.semester.toLowerCase() === semester.toLowerCase()
		) : false
		if (sem_data) {
			setCourses(sem_data.data);
			setResponse(sem_data.gp)
		}
		else {
			setCourses([]);
		}
	}, [lvl, semester])

	const addCourse = (code, grade, unit) => {
		if (codeState) {
			const newCourses = [...courses];
			const uid = newCourses.length + 1;
			newCourses.push({ id: uid, code, grade, unit });
			setCourses(newCourses);
			setResponse(null);
			setCodeState('');
			setGradeState('A');
			setUnitState('5');
		}
	};

	const filterCourses = (id) => {
		const newArr = courses.filter((single) => {
			return single.id !== id;
		});
		setCourses(newArr);
		setResponse(null);
	};

	const handleClear = () => {
		setCourses([]);
		setResponse(null);
		setCodeState('');
		setGradeState('A');
		setUnitState('5');
	};

	const calculateGP = async () => {
		setCalculating(true);
		let data = { grades: [], units: [] };
		courses.forEach((single) => {
			data.grades.push(single.grade);
			data.units.push(parseInt(single.unit));
		});
		await axios
			.post('https://toluwanimi.pythonanywhere.com/', data)
			.then((res) => {
				setCalculating(false);
				setResponse(res.data.data);
			})
			.catch((err) => {
				console.log(err);
				setCalculating(false);
				setResponse(null);
			});
	};

	const saveData = () => {
		setSaving(true)
		// check if lvl is already saved in LS
		const saved_data = JSON.parse(localStorage.getItem(`${lvl}-lvl`));

		// function to return semester data
		const sem_data = (sem) => ({
			id: sem.length + 1 || 0,
			semester,
			data: courses,
			gp: parseFloat(response),
		})

		let lvl_data = {
			lvl,
			semesters: [],
			GP: 0
		};

		// if lvl does not exist on DB create one
		if (!saved_data) {
			// creating lvl data
			lvl_data.semesters.push(sem_data(lvl_data.semesters));
			// storing lvl data in LS
			localStorage.setItem(`${lvl}-lvl`, JSON.stringify(lvl_data));
		}
		// if lvl exists in LS check if semester is the same
		else {
			// getting and checking semester data
			const currrent_sem = saved_data.semesters
			const checkSem = currrent_sem.find((i) => i.semester === semester)
			// if semester does not exist push and update the LS data with current semester
			if (!checkSem) {
				let updated_lvl = {
					...saved_data,
					semesters: [
						...currrent_sem,
						sem_data(currrent_sem)
					]
				}
				localStorage.setItem(`${lvl}-lvl`, JSON.stringify(updated_lvl));
				setTimeout(() => {
					setSaving(false)
				}, 2000);
			}
			else {
				let updated_lvl = {
					...saved_data,
					semesters: [
						...(currrent_sem.map((i) => {
							if (i.semester === semester) {
								i.data = courses
							}
							return i
						}))
					]
				}
				// update data
				localStorage.setItem(`${lvl}-lvl`, JSON.stringify(updated_lvl));
			}
		}
		const new_saved_data = JSON.parse(localStorage.getItem(`${lvl}-lvl`));
		const semCumGP = new_saved_data.semesters.reduce((acc, i) => { return acc + i.gp }, 0)
		const lvlGP = semCumGP / new_saved_data.semesters.length;
		new_saved_data.GP = lvlGP
		localStorage.setItem(`${lvl}-lvl`, JSON.stringify(new_saved_data));
		setTimeout(() => {
			setSaving(false)
		}, 1000);
	};
	
	return (
		<>
			<main
				style={{
					backgroundColor: darkmode ? 'rgb(0, 0, 22)' : 'aliceblue',
					color: darkmode ? 'white' : 'rgb(71, 71, 71)',
				}}
				className='app'>
				<div className='top-container'>
					<TopBar darkmode={darkmode} setDarkmode={setDarkmode} />
				</div>
				<div className='main-body'>
					<SavedBreadcrumb
						darkMode={darkmode}
						setlvl={setlvl}
						setSemester={setSemester} />
					<div className='main-body-top'>
						<div className='lvl-con'>
							<h3>Level:</h3>
							<select
								style={{
									color: darkmode
										? 'white'
										: 'rgb(71, 71, 71)',
								}}
								onChange={(e) => setlvl(e.target.value)}
								value={lvl}>
								<option value={100}>100 Level</option>
								<option value={200}>200 Level</option>
								<option value={300}>300 Level</option>
								<option value={400}>400 Level</option>
								<option value={500}>500 Level</option>
								<option value={600}>600 Level</option>
								<option value={700}>700 Level</option>
							</select>
						</div>
						<div className='sem-btn-con'>
							<div className='sem-con'>
								{/* <h3>Calculate your GP</h3> */}
								<h3>Semester:</h3>{' '}
								<select
									style={{
										color: darkmode
											? 'white'
											: 'rgb(71, 71, 71)',
									}}
									onChange={(e) =>
										setSemester(e.target.value)
									}
									value={semester}>
									<option value={'first'}>First</option>
									<option value={'second'}>Second</option>
								</select>
							</div>
							<div className='btn-con'>
								<button
									onClick={() =>
										addCourse(
											codeState,
											gradeState,
											unitState
										)
									}
									className='add-btn'>
									{' '}
									<AddCircleOutlineIcon /> Add Course{' '}
								</button>
								<button
									onClick={handleClear}
									className='clear-btn'>
									{' '}
									<HighlightOffIcon /> Clear{' '}
								</button>
							</div>
						</div>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							addCourse(codeState, gradeState, unitState);
						}}
						className='inputs-con'>
						<label>
							<span>Course Code: </span>
							<input
								style={{
									color: darkmode
										? 'white'
										: 'rgb(71, 71, 71)',
								}}
								required
								value={codeState}
								onChange={(e) => setCodeState(e.target.value)}
								type='text'
								placeholder='course code...'
							/>
						</label>
						<label>
							<span>Grade: </span>

							<select
								required
								style={{
									color: darkmode
										? 'white'
										: 'rgb(71, 71, 71)',
								}}
								value={gradeState}
								onChange={(e) => setGradeState(e.target.value)}>
								<option value={'A'}>A</option>
								<option value={'B'}>B</option>
								<option value={'C'}>C</option>
								<option value={'D'}>D</option>
								<option value={'E'}>E</option>
								<option value={'F'}>F</option>
							</select>
						</label>
						<label>
							<span>Unit: </span>
							{unitCustom ? (
								<div>
									<input
										type='number'
										placeholder='enter custom unit...'
										className='custon-unit-input'
										value={unitState}
										onChange={(e) => setUnitState(e.target.value)}
									/>
									<RemoveCircleOutlineIcon onClick={() => setUnitCustom(false)} />
								</div>
							) : (
								<select
									required
									style={{
										color: darkmode
											? 'white'
											: 'rgb(71, 71, 71)',
									}}
									value={unitState}
									onChange={(e) => {
										if (e.target.value === 'custom') {
											setUnitCustom(true)
										} else {
											setUnitState(e.target.value)
										}
									}
									}>
									<option value={5}>5</option>
									<option value={4}>4</option>
									<option value={3}>3</option>
									<option value={2}>2</option>
									<option value={1}>1</option>
									<option value='custom'>
										Custom
									</option>
								</select>
							)}
						</label>
					</form>
					<div
						style={{
							backgroundColor: darkmode
								? 'rgba(11, 11, 41, 0.822)'
								: 'white',
							display: courses.length > 0 ? 'block' : 'none',
						}}
						className='cal-body'>
						<div className='res-iten head'>
							<span title='Course Code' className='code-item'>
								Code
							</span>
							<span title='Grade' className='grade-item'>
								G
							</span>
							<span title='Unit' className='unit-item'>
								U
							</span>
						</div>

						{
							courses.map((singleCourse, index) => (
								<EachCourse
									data={singleCourse}
									key={index}
									filter={filterCourses}
								/>
							))
						}


						<div className='submit-btn-con'>
							<button
								disabled={calculating}
								onClick={calculateGP}>
								{calculating ? 'Calculating...' : 'Calculate'}
							</button>
						</div>
						{response && (
							<>
								<div className='response-con'>
									{' '}
									<h3>Your GP Is: {response}</h3>
								</div>
								<div className='save-con'>
									<button
										disabled={saving}
										className='saveBtn'
										onClick={saveData}>
										{saving ? 'Saving...' : 'Save'}
									</button>
								</div>
							</>
						)}
					</div>
					{courses.length < 1 &&
						(<div className="noData">
							No Course Added!!
						</div>)
					}
				</div>
				<div className='footer-container'>
					<Footer />
				</div>
			</main>
		</>
	);
}

export default App;
