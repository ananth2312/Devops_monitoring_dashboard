(async () => {
    try {
        const res = await fetch('http://localhost:5000/api/servers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serverName: "eb-prod-01",
                ipAddress: "192.168.1.10",
                environment: "production",
                status: "warning",
                location: "us-east-1"
            })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data:", data);
    } catch(err) {
        console.error("Fetch Error:", err);
    }
})();
