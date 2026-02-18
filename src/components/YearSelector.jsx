
export const YearSelector = ({
	year,
	onYearChange,
}) => {
	const currentYear = new Date().getFullYear();
	const years = [];
	for (let i = currentYear; i >= 1900; i--) {
		years.push(i);
	}

	return (
		<div className="year-selector-container">
			<select
				value={year || ""}
				onChange={(e) => {
					const val = e.target.value;
					onYearChange(val ? parseInt(val) : null);
				}}
				className="year-dropdown"
			>
				<option value="">Year</option>
				{years.map((y) => (
					<option key={y} value={y}>
						{y}
					</option>
				))}
			</select>
		</div>
	);
};
