module.exports = {
  orderItemText: (orderItems, itemText) => {
    for (let i = 0; i < orderItems.length; i++) {
      const { name, quantity } = orderItems[i];

      itemText += `${quantity}x ${name}, `;
    }
    return itemText;
  },

  paymentText: (payment_id, paymentText) => {
    switch (payment_id) {
      case "Bank - BPI":
        paymentText = `
        Please settle the payment, so we can process now your order.

        Bank: BPI
        Account Name: Marx's Joshua (Finance Name)
        Account Number: 3039022566

        Note: Please send proof of payment (screenshot, printscreen) to flowerninja26@gmail.com or send a message to our Facebook Page.`;
        return paymentText;

      case "GCash":
        paymentText = `
        Please settle the payment, so we can process now your order.

        E-Wallet: GCash
        Account Name: Marx's Joshua (Finance Name)
        Mobile Number: 0921 443 0131

        Note: Please send proof of payment (screenshot, printscreen) to flowerninja26@gmail.com or send a message to our Facebook Page.`;
        return paymentText;

      case "Paymaya":
        paymentText = `
        Please settle the payment, so we can process now your order.

        E-Wallet: Paymaya
        Account Name: Marx's Joshua (Finance Name)
        Mobile Number: 0916 509 1083

        Note: Please send proof of payment (screenshot, printscreen) to flowerninja26@gmail.com or send a message to our Facebook Page.`;
        return paymentText;

      default:
        return paymentText;
    }
  },
};
