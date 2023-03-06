const root = document.getElementById("root");
const ul = document.querySelector("ul");

export const createAddress = (address: string) => {
  createAndAppendLi(address);
};

export const createAndAppendLi = (value: string) => {
  const li = document.createElement("li");
  li.style.marginBottom = "10px";
  li.style.fontSize = "14px";
  li.style.whiteSpace = "pre-wrap";
  li.style.overflowX = "auto";
  li.innerText = value;

  if (ul) {
    apppendToUl(ul, li);
  }
};

const apppendToUl = (ul: HTMLUListElement, li: HTMLLIElement) => {
  ul.append(li);
};
