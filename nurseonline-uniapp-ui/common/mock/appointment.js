const appointments = [
	{
		appointmentId: '902270001_1',
		service: '打针',
		total: 376,
		nurse: '王护士',
		serviceTime: '2019年2月28日 13:30-14:00',
		status: 0,
		type: '待接单'
	},
	{
		appointmentId: '902270001_1',
		service: '打针',
		total: 376,
		nurse: '王护士',
		serviceTime: '2019年2月28日 13:30-14:00',
		status: 1,
		type: '待服务'
	},
	{
		appointmentId: '902270001_1',
		service: '打针',
		total: 376,
		nurse: '王护士',
		serviceTime: '2019年2月28日 13:30-14:00',
		status: 2,
		type: '待确认'
	}
]

export function getAppointments() {
	return new Promise((resolve,reject) => {
		resolve(appointments)
	})
}