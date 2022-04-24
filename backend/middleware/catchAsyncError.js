module.exports = theFuntc => (req, res, next) => {
    Promise.resolve(theFuntc(req, res, next)).catch(next);
}