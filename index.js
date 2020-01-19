const express = require('express');
const moment = require('moment');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
	// BEGIN
	if (req.query.year) {
		let year;
		year = parseInt(req.query.year);
		if (isNaN(year)) {
			res.json({ error: "Not a number" }).end();
			return;
		}
		const date = moment();
		date.year(year);
		date.dayOfYear(256);
		res.json({ data: date.format('DD/MM/YYYY') }).end();
	// END
	} else if (req.query.currentDate) {
		const data = (req.query.currentDate || "").match(/(\d{2})(\d{2})(\d{1,})/)
		if (!data || data.length < 4) {
			res.json({ error: "Bad date" });
		} else {
			const str = data.slice(1).join('-')
			const d = moment(str, 'DD-MM-YYYY');
			if (!d.isValid()) {
				res.json({ error: "Bad date" });
			} else {
				let day = setD(moment(d));
				if (day < d) {
					day.year(day.year() + 1);
					day = setD(day)
				}
				res.json({ data: day.diff(d, 'days')});
			}
		}
		res.end();
	} else {
		res.json({ error: "Unknown operation" });
	}
});

function setD (d) {
	d.dayOfYear(256);
	return d;
}

app.listen(80, () => {
	console.log('Listen on 80')
})
