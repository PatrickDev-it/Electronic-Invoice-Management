export default ({ res }) => {
    res.status(200).json({
        developer: "Enrico Vagnetti, Patrick Simonetti",
        version: "1.0.0",
    });
};
