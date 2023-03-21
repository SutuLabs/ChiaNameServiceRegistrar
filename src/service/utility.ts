export function copy(copyText: string): void {
    const textArea = document.createElement("textarea");
    textArea.value = copyText;

    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand("copy");
    } catch (err) {
        console.warn("failed to copy: ", err);
    }

    document.body.removeChild(textArea);
}

export type Hex0x = "()" | `0x${string}`;

export function unprefix0x(str: Hex0x | string | undefined): string {
    return str && str.startsWith("0x") ? str.substring(2) : (str ?? "");
  }