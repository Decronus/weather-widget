const main = (latitude, longitude) => {
	const request = new XMLHttpRequest();
	request.responseType = 'json';
	request.open('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${lang}&appid=${API_KEY}`);
	request.send();

	request.onload = () => {
		console.log(request.response);

		loadingData.classList.add('hidden');
		iconEdit.classList.remove('hidden');
		iconGeo.classList.remove('hidden');
		iconEdit.addEventListener('click', () => {
			input.classList.remove('hidden');
			close.classList.remove('hidden');
		})

		close.addEventListener('click', () => {
			input.classList.add('hidden');
			close.classList.add('hidden');
			suggest.classList.add('hidden');
			input.value = '';
		})

		let choicedCityLatitude = '';
		let choicedCityLongitude = '';
		input.addEventListener('input', () => {
			suggest.classList.remove('hidden');
			let arr = [];
			arr = cities.filter(el => {
				return el.name.toLowerCase().startsWith(input.value.toLowerCase());
			})

			suggest.innerHTML = '';
			
			arr.forEach(element => {
				const suggestElement = document.createElement('p');
				suggestElement.textContent = element.name;
				suggestElement.style.cursor = 'pointer';
				suggestElement.style.fontSize = '12px';
				suggest.append(suggestElement);
			});

			if (suggest.childNodes.length === 0) {
				suggest.textContent = 'Город не найден';
			}

			console.log(input.value);
			console.log(arr);
		})

		suggest.addEventListener('click', (event) => {
			const target = event.target;

			console.log(target.textContent);
			city.textContent = target.textContent;

			input.classList.add('hidden');
			close.classList.add('hidden');
			suggest.classList.add('hidden');
			input.value = '';

			for (let el of cities) {
				if (el.name === target.textContent) {
					choicedCityLatitude = el.lat;
					choicedCityLongitude = el.lng;
					main(choicedCityLatitude, choicedCityLongitude);
					city.textContent = el.name;
					break;
				}
			}
		})

		const setTime = () => {
			const newDate = new Date();
			let minutes = newDate.getMinutes();
			if (minutes >= 0 && minutes <= 9) {
				minutes = '0' + minutes;
			}
			time.textContent = newDate.getHours() + ':' + minutes;
		}

		setInterval(setTime, 100);

		temp.innerHTML = Math.round(request.response.main.temp - 273.15) + '&deg;';

		let month = newDate.getMonth();
		switch (month) {
			case 0:
				month = 'января';
			case 1:
				month = 'февраля';
			case 2:
				month = 'марта';
			case 3:
				month = 'апреля';
			case 4:
				month = 'мая';
			case 5:
				month = 'июня';
			case 6:
				month = 'июля';
			case 7:
				month = 'августа';
			case 8:
				month = 'сентября';
			case 9:
				month = 'октября';
			case 10:
				month = 'ноября';
			case 11:
				month = 'декабря';
		}
		date.textContent = newDate.getDate() + ' ' + month;

		tempFeels.innerHTML = 'Ощущается как' + ' ' + Math.round(request.response.main.feels_like - 273.15) + '&deg;';
		weatherDescPar.textContent = request.response.weather[0].description[0].toUpperCase() + request.response.weather[0].description.slice(1);
		city.textContent = request.response.name;
		image.setAttribute('src', `http://openweathermap.org/img/wn/${request.response.weather[0].icon}@2x.png`);
		humidity.textContent = `Вл. возд. ${request.response.main.humidity}%`;
		pressure.textContent = `Атм. давл. ${Math.round(request.response.main.pressure * 100 / 133.321995)} мм рт. ст.`;
	}
}