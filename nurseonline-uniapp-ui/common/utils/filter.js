export const priceFormat = value => {
	let price = Number(value)
	if(price !== NaN){
		return price.toFixed(2)
	}
	else{
		return value
	}
}