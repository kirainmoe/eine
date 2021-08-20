export const getUserAvatarUrl = (userId: number) => `http://q.qlogo.cn/g?b=qq&s=100&nk=${userId}`;

export const getGroupAvatarUrl = (groupId: number) => `http://p.qlogo.cn/gh/${groupId}/${groupId}/0`;