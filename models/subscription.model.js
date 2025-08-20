import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subscription name is required"],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: 0,
    
  },
  currency: {
    type: String,
    enum: ["USD", "EUR", "GBP", "INR", "NGN"],
    default: "USD",
    uppercase: true,
  },
    billingCycle: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        required: [true, "Billing cycle is required"],
    },

    category: {
        type: String,
        enum: ["basic", "standard", "premium"],
        required: [true, "Category is required"],
    },
    paymentMethod: {
        type: String,
        enum: ["credit_card", "paypal", "bank_transfer"],
        required: [true, "Payment method is required"],
        trim: true,
    },

    status: {
        type: String,
        enum: ["active", "cancelled", "paused"],
        default: "active",
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate:{
            validator: (value) => value <= new Date(),
            message: "Start date cannot be in the future"
        }
    },
   renewalDate: {
       type: Date,
       required: [false, "Renewal date is required"],
       validate: {
           validator: function (value) {
               return value > this.startDate();
           },
           message: "Renewal date must be after the start date"
       }
   },

   user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: [true, "User ID is required"],
       index: true
   },

}, { timestamps: true });


//Auto-calculate renewal date is missing
subscriptionSchema.pre("save", function (next) {
   if (!this.renewalDate) {
       const renewalPeriods = {
           daily: 1,
           weekly: 7,
           monthly: 30,
           yearly: 365
       };
       this.renewalDate = new Date(this.startDate);
       this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.billingCycle]);
   }
   //Auto-update the status
   if (this.renewalDate < new Date()) {
       this.status = "cancelled";
   }
   next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
