export default function handler(req, res) {
    fetch(
        process.env.NEXT_PUBLIC_CHART_FETCH_URL?.replace(
            ":userId",
            req.headers["x-user-id"]
        ),
        {
            method: "GET",
            headers: {
                Authorization: req.headers["authorization"],
            },
        }
    )
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((body) => {
            console.debug("Received response body:", body);
            res.json({ charts: body?.charts?.filter((c) => c) });
        })
        .catch((err) => {
            console.error("Error fetching charts:\n", err);
            res.status(500).json({ error: err });
        });
}
