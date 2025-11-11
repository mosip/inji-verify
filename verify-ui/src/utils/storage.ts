export class Storage {
    public static readonly SELECTED_LANGUAGE = "selected_language";
    public static readonly ESSENTIAL_CLAIM = "essential_claim";
    public static readonly setItem = (key: string, value: any) => {
    switch (key) {
      case Storage.SELECTED_LANGUAGE:
        localStorage.setItem(key, JSON.stringify(value));
        break;
      case Storage.ESSENTIAL_CLAIM: {
          const storedClaims = JSON.parse(localStorage.getItem(key) || "[]");
          if (!storedClaims.some((claim: { type: any }) => claim.type === value.type)) {
              storedClaims.push(value);
              localStorage.setItem(key, JSON.stringify(storedClaims));
          }
          break;
      }
      default:
        break;
    }
  };

    public static readonly getItem = (key: string) => {
    let data = localStorage.getItem(key);
    if (data) {
      data = JSON.parse(data);
    }
    return data;
  };
}
