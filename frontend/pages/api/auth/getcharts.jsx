export default function handler(req, res) {
    fetch(
        process.env.NEXT_PUBLIC_CHART_FETCH_URL?.replace(":userId", req.get("X-User-ID"), {
            headers: {
                Authorization: req.get("Authorization"),
            },
        })
    )
        .then((response) => response.json())
        .then((body) => {
            console.debug("Received response body:", body);
            res.json({ charts: body?.charts?.filter((c) => c) });
        })
        .catch((err) => {
            console.error("Error fetching charts:\n", err);
            res.status(500).json({ error: err });
        });
}
