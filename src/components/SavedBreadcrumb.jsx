import React, { useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SavedBreadcrumb = ({ darkMode, setSemester, setlvl }) => {
	const [collapse, setCollapse] = useState(true);
	const [cgpa, setCgpa] = useState(null);

	const allData = []
	for (let i = 100; i <= 700; i += 100) {
		const saved_data = JSON.parse(localStorage.getItem(`${i}-lvl`));
		if (saved_data) {
			allData.push(saved_data)
		}
	};

	const handleDelete = (lvl) => {
		localStorage.removeItem(`${lvl}-lvl`);
		setlvl('100')
		setSemester('First')
	}

	const handleCgpaCalc = () => {
		const calc = allData.reduce((acc, i) => { return acc + i.GP }, 0)
		const res = calc / allData.length
		setCgpa(res)
	}

	return (
		<div className='saved-bread-con'>
			<div className='saved-bread-top'>
				<h3>Saved Data</h3>
				<span
					style={{
						transform: collapse ? 'rotate(0)' : 'rotate(180DEG)',
					}}>
					<ExpandMoreIcon onClick={() => setCollapse(!collapse)} />
				</span>
			</div>
			<div
				className='saved-bread'
				style={{
					height: collapse ? '0px' : 'auto',
					padding: collapse ? '0' : '20px 0',
				}}>
				{
					allData.length >= 1
						?
						(
							<>
								<div className="saved-bread-main" style={{
									height: collapse ? '0px' : 'auto',
									padding: collapse ? '0' : '20px 0',
								}}>
									{
										allData.map((singlelvl, index) => {
											return (
												<div
													className='each-saved'
													style={{
														backgroundColor: darkMode
															? 'rgba(11, 11, 41, 0.822)'
															: 'white',
													}}
													key={index}
												>
													<div onClick={() => { setlvl(singlelvl.lvl); setSemester('First') }} className='first'>
														<div className='lvl'>{singlelvl.lvl} lvl</div>
														{/* <div className='gp'>{singlelvl.gpa} GPA</div> */}
														<div className='gp'>{singlelvl.GP.toFixed(2)} GPA</div>
													</div>
													<div onClick={() => handleDelete(singlelvl.lvl)} className='second'>
														<HighlightOffIcon />
													</div>
												</div>

											);
										})}
								</div>
								<div className="btn-cgpa-res">
									<button onClick={() => handleCgpaCalc()} className="btn">Calculate CGPA For Saved Data</button>
									{
										cgpa && (<span>CGPA: {cgpa.toFixed(2)}</span>)
									}

								</div>
							</>
						)

						:
						(
							<div className='no_data'>
								No Saved Data!!!
							</div>
						)
				}
			</div>
		</div>
	);
};

export default SavedBreadcrumb;
