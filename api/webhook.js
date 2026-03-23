export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.NOTION_DB_ID;

  if (!NOTION_TOKEN || !DATABASE_ID) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  try {
    const data = req.body;

    const hospitalName = data["병원명"] || "";
    const name = data["name"] || "";
    const phone = data["연락처"] || "";
    const email = data["email"] || "";
    const problems = Array.isArray(data["problems"])
      ? data["problems"].join(", ")
      : data["problems"] || "";
    const currentMarketing = Array.isArray(data["current_marketing"])
      ? data["current_marketing"].join(", ")
      : data["current_marketing"] || "";

    const title = hospitalName || name || "신규 문의";

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          "문의 제목": {
            title: [{ text: { content: title } }],
          },
          상태: {
            select: { name: "접수" },
          },
          "문의 유형": {
            select: { name: "홈페이지" },
          },
          문의자명: {
            rich_text: [{ text: { content: name } }],
          },
          연락처: phone
            ? { phone_number: phone }
            : { phone_number: "" },
          이메일: {
            email: email || null,
          },
          접수일: {
            date: { start: new Date().toISOString().split("T")[0] },
          },
          메모: {
            rich_text: [
              {
                text: {
                  content: `고민: ${problems}\n현재 마케팅: ${currentMarketing}\n예산: ${data["budget"] || "미선택"}`,
                },
              },
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
