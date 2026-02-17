export const YearSelector = ({
	fromYear,
	toYear,

	onFromYearChange,
	onToYearChange,
}) => {
	return (
		<div className="year-range">
			From
			<select
				onChange={(e) => {
					console.log("From year:", e.target.value);
					onFromYearChange(e.target.value);
					onToYearChange((prev) => Math.max(prev, e.target.value));
				}}
			>
				{YEARS.map((year) => (
					<option key={year} value={year} selected={year === fromYear}>
						{year}
					</option>
				))}
			</select>
			to
			<select
				onChange={(e) => {
					console.log("To year:", e.target.value);

					onToYearChange(e.target.value);
					onFromYearChange((prev) => Math.min(prev, e.target.value));
				}}
			>
				{YEARS.map((year) => (
					<option key={year} value={year} selected={year === toYear}>
						{year}
					</option>
				))}
			</select>
		</div>
	);
};
const YEARS = [];

for (let year = 2000; year <= new Date().getFullYear(); year++) {
	YEARS.push(year);
}
