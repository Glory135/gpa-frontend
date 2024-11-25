export const calCGP = (semesters) => {
	const each_total_credit_point = semesters.map((i) =>
		i.data.reduce((acc, accI) => {
			const grade_unit = grade_to_point(accI.grade) * parseInt(accI.unit);
			return acc + grade_unit;
		}, 0)
	);
	const total_credit_point = each_total_credit_point.reduce(
		(acc, i) => acc + i,
		0
	);

	const each_total_load_unit = semesters.map((i) =>
		i.data.reduce((acc, accIi) => acc + parseInt(accIi.unit), 0)
	);
	const total_load_unit = each_total_load_unit.reduce((acc, i) => acc + i, 0);

	const total_cgpa = total_credit_point / total_load_unit;

	return total_cgpa;
};

export const grade_to_point = (grade) => {
	if (grade.toLowerCase() === 'a') {
		return 5;
	}
	if (grade.toLowerCase() === 'b') {
		return 4;
	}
	if (grade.toLowerCase() === 'c') {
		return 3;
	}
	if (grade.toLowerCase() === 'd') {
		return 2;
	}
	if (grade.toLowerCase() === 'e') {
		return 1;
	}
	if (grade.toLowerCase() === 'f') {
		return 0;
	}
};
