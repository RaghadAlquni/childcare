const childrenModel = require("../../DB/models/childrenSchema.js")

const addChildren = async (req, res) => {
    try {
        const { childName, age, gender, guardian, branch } = req.body;
        // validate input
        if (!childName || !age || !gender || !guardian || !guardian.guardianName || !guardian.relationship || !guardian.phoneNumber || !branch) {
        return res.status(400).json({ message: 'Please provide all required child and guardian information. '});
    }
    const newChildren = new childrenModel({
        childName, 
        age, 
        gender, 
        guardian, 
        branch,
        status: 'مضاف'
      });
      await newChildren
      .save();

      res.status(201).json({ message: 'Child added successfully', newChildren});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding child', error: error.message})
    }    
    };
    
const getOneChild = async (req, res) => {
    try {
        const {id} = req.params
        if(!id) {
            return res.status(400).json({message: 'Please provide child ID'});
        }
        const child = await childrenModel.findById(id);
        if (!child) {
            return res.status(404).json({ message: "Child not found" });
        }
                res.status(200).json({ message: "Child retrieved successfully", child });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error retrieving child", error: error.message });
            }
        };

        const getAllChildren = async (req, res) => {
            try {
    const children = await childrenModel.find(); // retrived all children

    if (children.length === 0) {
      return res.status(404).json({ message: "No children found" });
    }
res.status(200).json({ message: "Children retrieved successfully", children });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving children", error: error.message });
  }
};


        const updateChild = async (req, res) => {   
        try {
        const { id } = req.params;  
        const update = req.body;   
        if(!id) {
            return res.status(400).json({ message: "Please provide child ID"});
        }
        const updateOneChild = await childrenModel.findById(id);
        if(!updateOneChild) {
            return res.status(404).json({ message: "Child not found"});
        }

        if(update.guardian) {
            updateOneChild.guardian = {
                ...updateOneChild.guardian.toObject(),
                ...update.guardian
            };
            delete update.guardian;
        }
        Object.keys(update).forEach((key) => {
            updateOneChild[key] = update[key];
        });

        const saved = await updateOneChild.save()
        res.status(200).json({ message: "Child updated successfully", child: saved })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating child", error: error.message });
    }
}

const deleteChild = async (req, res) => {
    try {
                const { id } = req.params;
                if(!id) {
            return res.status(400).json({ message: "Please provide child ID"});
        }
                const deletedChild = await childrenModel.findByIdAndDelete(id);

        if(!deletedChild) {
            return res.status(404).json({ message: "Child not found"});
        }
        res.status(200).json({ message: "Child deleted successfully", child: deletedChild })
     } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting child", error: error.message });
            }
        
    }

    // Confirm child by center
const confirmChild = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide child ID" });
    }

    // تحديث حالة الطفل إلى "confirmed"
    const updatedChildstatus = await childrenModel.findByIdAndUpdate(
      id,
      { status: "مؤكد" },
      { new: true }
    );

    if (!updatedChildstatus) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.status(200).json({ message: "Child confirmed successfully", child: updatedChildstatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error confirming child", error: error.message });
  }
};


const inActiveChild = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide child ID" });
    }

    // تحديث حالة الطفل إلى "confirmed"
    const ubdateChildstatusInactive = await childrenModel.findByIdAndUpdate(
      id,
      { status: "غير مفعل" },
      { new: true }
    );

    if (!ubdateChildstatusInactive) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.status(200).json({ message: "Children mark inconfirmed successfully", child: ubdateChildstatusInactive });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error confirming child", error: error.message });
  }
};



// Mark all children as inactive
const markAllChildrenInactive = async (req, res) => {
  try {
    const result = await childrenModel.updateMany(
      {}, // الشرط {} يعني كل الأطفال
      { status: "غير مفعل" } // التحديث
    );

    res.status(200).json({
      message: "All children marked as inactive successfully",
      modifiedCount: result.modifiedCount // عدد الأطفال الذين تغيرت حالتهم
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking children as inactive", error: error.message });
  }
};



    module.exports = {addChildren, getOneChild, getAllChildren, updateChild , deleteChild, confirmChild, inActiveChild, markAllChildrenInactive}