import WaitForPage from "./WaitForPage";

export default new class BrainlyApi {
  private apiPath = "https://znanija.com/api/28";

  private async Request<T>(
    method: "GET" | "POST",
    apiMethod: string,
    body?
  ): Promise<T> {
    const data = await fetch(`${this.apiPath}/${apiMethod}`, {
      method,
      body: method === "GET" ? null : JSON.stringify(body)
    })
      .then(data => data.json());

    if (!data.success) throw Error(data.message);

    return data.data;
  }

  async GetDM(userId: number): Promise<{
    conversation: {
      id: number;
      user_id: number;
      created: string;
      recipient_id: number;
      allow_link_from: unknown[];
    };
    last_id: number;
    messages: {
      id: number;
      conversation_id: number;
      user_id: number;
      created: string;
      content: string;
      is_harmful: boolean;
      new: boolean;
    }[];
  }> {
    const conversation: {
      conversation_id: number
    } = await this.Request("POST", "api_messages/check", {
      user_id: userId
    });

    return await this.Request("GET", `api_messages/get_messages/${conversation.conversation_id}`);
  }

  async GetUserContent(userId: number, type: "tasks" | "answers" | "comments") {
    const contentType = {
      "tasks": "tasks",
      "answers": "responses",
      "comments": "comments_tr"
    }[type];
  
    const page = await WaitForPage(`/users/user_content/${userId}/${contentType}`);

    return [...page.querySelectorAll("table > tbody > tr")].map(row => {
      const dateSelector = row.querySelector("td:last-child");

      return {
        content: row.querySelector("a").innerText.trim(),
        taskLink: row.querySelector("a").href,
        date: dateSelector.textContent,
        subject: dateSelector.previousElementSibling.textContent
      };
    });
  }

}();