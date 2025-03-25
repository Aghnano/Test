const handler = async () => {
  const query = `
    query {
      boards(ids: 8773609198) {
        items {
          id
          name
          created_at
          column_values {
            id
            type
            value
            column {
              id
              title
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.MONDAY_API_KEY
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: result.errors[0].message })
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.data.boards[0].items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message })
    };
  }
};

export { handler };
