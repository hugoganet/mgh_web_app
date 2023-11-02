function customLogger(query) {
    if (query.startsWith('INSERT')) {
        // Assuming standard SQL INSERT format and that values are separated by commas.
        let parts = query.split('VALUES');
        if (parts.length > 1) {
            // Extract only the first 3 rows of data from the INSERT query
            let rows = parts[1].split('),(');
            if (rows.length > 3) {
                rows = rows.slice(0, 3);
                parts[1] = rows.join('),(') + ',...'; // Append '...' to indicate more rows exist
            }
            console.log(parts[0] + 'VALUES' + parts[1]);
        } else {
            // Log the query as is if it doesn't match the expected format
            console.log(query);
        }
    } else {
        // For other types of queries, log them as usual
        console.log(query);
    }
}
