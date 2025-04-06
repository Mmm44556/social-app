import { useRouter } from "next/navigation";

export default function useNavigateToComment() {
  const router = useRouter();

  const navigateToComment = (userTagName: string, commentId: string) => {
    //如果有選取文字，不觸發跳轉
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      return;
    }
    router.push(`/${userTagName}/post/${commentId}`, { scroll: false });
  };

  return navigateToComment;
}
