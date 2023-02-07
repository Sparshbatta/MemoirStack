import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const extraData = req.headers.authorization?.split(' ')[1];
        let decodedData;
        if (!extraData?.startsWith('subToken')) {
            decodedData = jwt.verify(extraData, process.env.JWT_SECRET);
            req.userId = decodedData?.id;
        } else {
            req.userId = extraData?.slice(8);
        }
        next(); 
    } catch (error) {
        console.log(error.message);
    }
};

export default auth;