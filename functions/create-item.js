const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    // Preflight request for CORS
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const { itemName } = JSON.parse(event.body || "{}");

  if (!itemName) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ message: "Missing itemName" }),
    };
  }

  const query = `
    mutation {
      create_item(board_id: 8773609198, item_name: "${itemName}") {
        id
      }
    }
  `;

  try {
    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.MONDAY_API_KEY,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: result.errors[0].message }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ id: result.data.create_item.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };

