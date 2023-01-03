// export default (fn) => {
// 	return (req, res, next) => {
// 		fn(req, res, next).catch(next);
// 	};
// };

const asyncWrapper = (fn)=>{
	const x = async(req,res,next) =>{
		try{
			await fn(req,res,next)
		}catch(error){
			next(error)
		}
	}
	return x
}

module.exports = asyncWrapper