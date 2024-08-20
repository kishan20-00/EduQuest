import numpy as np
import pandas as pd
import os

# Specify the directory path where your images are located
image_directory = "C:\\Users\\Kishan raj\\Documents\\GitHub\\EduQuest\\eye_track\\Images"

# List all files in the specified directory
for filename in os.listdir(image_directory):
    if os.path.isfile(os.path.join(image_directory, filename)):
        print(os.path.join(image_directory, filename))


import numpy as np 
import pandas as pd 
import os
import tensorflow as tf

from glob import glob
from tqdm import tqdm

import matplotlib.pyplot as plt
from PIL import Image

X = []
Y = []

for i in tqdm(glob('C:/Users/Kishan raj/Documents/GitHub/EduQuest/eye_track/Images/train/focus/*')):
    temp = np.array(Image.open(i).resize((64,64)))
    X.append(temp)
    Y.append(1)
    
for i in tqdm(glob('C:/Users/Kishan raj/Documents/GitHub/EduQuest/eye_track/Images/train/unfocus/*')):
    temp = np.array(Image.open(i).resize((64,64)))
    X.append(temp)
    Y.append(0)  


X = np.array(X)
X = X/255.0
Y = np.array(Y)


X.shape

X = np.expand_dims(X,-1)

X.shape

from sklearn.model_selection import train_test_split
x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.33, random_state=42)

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input, Conv2D, BatchNormalization, MaxPooling2D,Dropout, Flatten

model = tf.keras.models.Sequential([
      Input(shape=(64, 64, 1)),

      Conv2D(filters = 32, kernel_size = 5, strides = 1, activation = 'relu'),
      Conv2D(filters = 32, kernel_size = 5, strides = 1, activation = 'relu', use_bias=False),
      BatchNormalization(),
      MaxPooling2D(strides = 2),
      Dropout(0.3),

      Conv2D(filters = 64, kernel_size = 3, strides = 1, activation = 'relu'),
      Conv2D(filters = 64, kernel_size = 3, strides = 1, activation = 'relu', use_bias=False),
      BatchNormalization(),
      MaxPooling2D(strides = 2),
      Dropout(0.3),

      Flatten(),
      Dense(units  = 256, activation = 'relu', use_bias=False),
      BatchNormalization(),

      Dense(units = 128, use_bias=False, activation = 'relu'),

      Dense(units = 84, use_bias=False, activation = 'relu'),
      BatchNormalization(),
      Dropout(0.3),

      Dense(units = 1, activation = 'sigmoid')
  ])


model.compile(loss='binary_crossentropy',optimizer='adam', metrics=['accuracy'])

callback = tf.keras.callbacks.ModelCheckpoint(
    filepath='prediction.keras',
    save_weights_only=False,
    monitor='val_loss',
    mode='min',
    save_best_only=True,
    verbose =1)
model.fit(x_train, y_train, validation_split=0.2, epochs=30, batch_size=32, callbacks=callback)

from keras.models import save_model
save_model(model, 'detection.h5')

from keras.models import load_model
best_model = load_model('C:/Users/Kishan raj/Documents/GitHub/EduQuest/eye_track/prediction.keras')
best_model.evaluate(x_test, y_test)

for i in x_test[10:15]:
    result = best_model.predict(np.expand_dims(i,0))
    plt.imshow(i)
    plt.show()
    
    if result > 0.5:
        print('Focus')
    else:
        print("Non Focus")

from sklearn.metrics import confusion_matrix
import seaborn as sns

plt.figure(figsize=(15, 5))

preds = best_model.predict(x_test)
preds = (preds >= 0.5).astype(np.int32)
cm = confusion_matrix(y_test, preds)
df_cm = pd.DataFrame(cm, index=['Non Focus', 'Focus'], columns=['Non Focus', 'Focus'])
plt.subplot(121)
plt.title("Confusion matrix\n")
sns.heatmap(df_cm, annot=True, fmt="d", cmap="YlGnBu")
plt.ylabel("Predicted")
plt.xlabel("Actual")
