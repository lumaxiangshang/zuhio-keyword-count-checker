/**
 * 数据库工具库
 * 
 * 注意：当前使用内存存储作为示例
 * 生产环境请替换为真实的数据库（如 PostgreSQL + Prisma）
 */

// 内存存储（示例用）
interface User {
  id: string;
  email: string;
  credits: number;
  subscriptionPlan: 'free' | 'pro' | 'business';
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'one-time' | 'subscription';
  credits?: number;
  createdAt: Date;
}

// 内存数据库（示例）
const users = new Map<string, User>();
const payments = new Map<string, Payment>();

export const db = {
  user: {
    async create(data: Omit<User, 'createdAt' | 'updatedAt'>) {
      const user: User = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.set(user.id, user);
      return user;
    },

    async findById(id: string) {
      return users.get(id) || null;
    },

    async findByEmail(email: string) {
      return Array.from(users.values()).find(u => u.email === email) || null;
    },

    async update(id: string, data: Partial<User>) {
      const user = users.get(id);
      if (!user) throw new Error('User not found');
      
      const updated = { ...user, ...data, updatedAt: new Date() };
      users.set(id, updated);
      return updated;
    },

    async addCredits(id: string, amount: number) {
      const user = users.get(id);
      if (!user) throw new Error('User not found');
      
      const updated = {
        ...user,
        credits: user.credits + amount,
        updatedAt: new Date(),
      };
      users.set(id, updated);
      return updated;
    },
  },

  payment: {
    async create(data: Omit<Payment, 'createdAt'>) {
      const payment: Payment = {
        ...data,
        createdAt: new Date(),
      };
      payments.set(payment.id, payment);
      return payment;
    },

    async findById(id: string) {
      return payments.get(id) || null;
    },

    async findByPaypalOrderId(orderId: string) {
      return Array.from(payments.values()).find(p => p.paypalOrderId === orderId) || null;
    },

    async update(id: string, data: Partial<Payment>) {
      const payment = payments.get(id);
      if (!payment) throw new Error('Payment not found');
      
      const updated = { ...payment, ...data };
      payments.set(id, updated);
      return updated;
    },
  },
};

// 导出类型
export type { User, Payment };
